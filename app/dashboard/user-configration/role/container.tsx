"use client";

import { useState } from "react";
import { baseURL } from "@/app/config";

import Search from "@/ui/search";
import RoleTable from "./table";
import { Role } from "@/interface/role";
import { Button } from "antd";
import RoleForm from "./form";
import { useAuth } from "@/providers/auth/AuthProvider";
import { ApiResponse } from "@/interface/api";

interface ContainerPropeType {
  initialData: Role[];
}

export default function Container({ initialData }: ContainerPropeType) {
  const { accessToken } = useAuth();
  const [roles, setRoles] = useState(initialData);

  const [query, setQuery] = useState("");
  const [roleForm, setRoleForm] = useState<{
    visible: boolean;
    editData: null | Role;
    loading: boolean;
  }>({ visible: false, editData: null, loading: false });
  const filteredRoles = roles.filter((role) =>
    role.Name.toLocaleLowerCase().includes(query)
  );

  const hideRoleForm = () => setRoleForm({ ...roleForm, visible: false });
  const handleFormSubmit = async (values: any) => {
    setRoleForm({ ...roleForm, loading: true });
    if (roleForm.editData) {
      const responseBody = await fetch(
        `${baseURL}/role/${roleForm.editData.Id}`,
        {
          method: "PATCH",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (responseBody.ok) {
        const body = (await responseBody.json()) as ApiResponse<Role>;
        const role = {
          ...body.data,
          Permissions: body.data?.Permissions.map((per) => ({ Name: per })),
        };
        const roleIdx = roles.findIndex((role) => role.Id === body.data?.Id);
        const newRoles = [...roles];
        if (typeof roleIdx === "number")
          newRoles[roleIdx] = role as unknown as Role;
        setRoles(newRoles);
        setRoleForm({ editData: null, visible: false, loading: false });
      } else {
        setRoleForm({ ...roleForm, loading: false });
      }
    } else {
      const responseBody = await fetch(`${baseURL}/role`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });

      if (responseBody.ok) {
        const body = (await responseBody.json()) as ApiResponse<Role>;
        const role = {
          ...body.data,
          Permissions: body.data?.Permissions.map((per) => ({ Name: per })),
        };
        setRoles([...roles, role] as unknown as Role[]);
        setRoleForm({ editData: null, visible: false, loading: false });
      } else {
        setRoleForm({ ...roleForm, loading: false });
      }
    }
  };

  if (roleForm.visible)
    return (
      <div className="w-full overflow-hidden">
        <RoleForm
          roleForm={roleForm}
          handleFormSubmit={handleFormSubmit}
          hideRoleForm={hideRoleForm}
        />
      </div>
    );

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-medium text-gray-700">Roles</h1>
        <p className="text-gray-500">
          A list of roles retrieved from a database.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Search loading={false} setQueryE={setQuery} />
        <Button
          htmlType="button"
          type="primary"
          className="bg-[#1677ff]"
          size="large"
          onClick={() =>
            setRoleForm({ ...roleForm, visible: true, editData: null })
          }
        >
          Add Role
        </Button>
      </div>

      <RoleTable setRoleForm={setRoleForm} data={filteredRoles} />
    </div>
  );
}
