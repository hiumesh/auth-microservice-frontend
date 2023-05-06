"use client";

import { useState, useCallback, useMemo, useEffect, ChangeEvent } from "react";
import { Button, Input, Popover } from "antd";
import { Column } from "react-table";
import { AiOutlineInfoCircle } from "react-icons/ai";

import { useAuth } from "@/providers/auth/AuthProvider";
import { baseURL } from "@/app/config";

import {
  PermissionList,
  Permission,
  PermissionListAPI,
} from "@/interface/permission";
import { ApiResponse } from "@/interface/api";

import PermissionTable from "./table";
import PermissionForm from "./form";
export default function Container({
  initialTableData,
}: {
  initialTableData: PermissionList | undefined;
}) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<PermissionList | undefined>(
    initialTableData
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [permissionForm, setPermissionForm] = useState<{
    visible: boolean;
    editData: null | Permission;
    loading: boolean;
  }>({ visible: false, editData: null, loading: false });

  const columns: readonly Column[] = useMemo(
    () => [
      {
        Header: "Permission",
        accessor: "Name",
        Cell: (cel) => {
          return (
            <p className="py-4 font-medium text-gray-900 whitespace-nowrap">
              {cel.value}
            </p>
          );
        },
      },
      {
        Header: "Info",
        Cell: (cel) => {
          const rowData = cel.row.original as Permission;
          return (
            <div className="w-full h-full flex items-center">
              <Popover
                
                content={<div>
                  <h2 className="text-gray-700 mb-1">Microservices</h2>
                  <div className="relative -left-1 mb-2">{rowData.Microservices.map((m) => <span key={m.Name} className="bg-slate-200 border-gray-800 rounded-md p-1 m-1">{m.Name}</span>)}</div>
                  <h2 className="text-gray-700 mb-1">Roles</h2>
                  <div className="relative -left-1">{rowData.Roles.map((r) => <span key={r.Name} className="bg-pink-200 border-pink-800 rounded-md p-1 m-1">{r.Name}</span>)}</div>
                </div>}
                placement="bottomRight"
                trigger="click"
              >
                <Button
                  className="flex justify-center"
                  icon={
                    <AiOutlineInfoCircle
                      fontSize={20}
                      className="text-gray-500"
                    />
                  }
                  type="ghost"
                />
              </Popover>{" "}
            </div>
          );
        },
        width: 15,
      },
      {
        Header: "Action",
        Cell: (cel) => {
          const rowData = cel.row.original as Permission;
          return (
            <div className="w-full h-full flex items-center">
              <Button
                htmlType="button"
                type="link"
                size="small"
                onClick={() =>
                  setPermissionForm({
                    visible: true,
                    editData: rowData,
                    loading: false,
                  })
                }
              >
                Edit
              </Button>
            </div>
          );
        },
        width: 24,
      },
    ],
    []
  );

  const fetchData = useCallback(
    async (filter: { pageIndex: number; pageSize: number; name: string }) => {
      const { pageIndex, pageSize, name = "" } = filter;
      setLoading(true);
      const response = await fetch(
        `${baseURL}/permission?limit=${pageSize}&offset=${
          pageSize * pageIndex
        }&name=${name}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLoading(false);
      const responseBody = (await response.json()) as PermissionListAPI;
      if (responseBody.success && responseBody.data) setData(responseBody.data);
    },
    [accessToken]
  );
  const hidePermissionForm = () =>
    setPermissionForm({ ...permissionForm, visible: false });

  const handleFormSubmit = async (values: any) => {
    setPermissionForm({ ...permissionForm, loading: true });
    if (permissionForm.editData) {
      const responseBody = await fetch(
        `${baseURL}/permission/${permissionForm.editData.Id}`,
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
        const body = (await responseBody.json()) as ApiResponse<Permission>;
        /* const permission = {
          ...body.data,
          Roles: body.data?.Roles.map((ro) => ({ Name: ro })),
          Microservices: body.data?.Microservices.map((m) => ({ Name: m })),
        };
        const permissionIdx = data?.rows.findIndex(
          (per) => per.Id === body.data?.Id
        );

        const newPermissions = { ...data } as PermissionList;
        if (typeof permissionIdx === "number")
          (newPermissions.rows as Permission[])[permissionIdx] =
            permission as unknown as Permission;

        setData(newPermissions); */
        setPermissionForm({ editData: null, visible: false, loading: false });
        setQuery(body.data?.Name || "");
      } else {
        console.log(await responseBody.json());
        setPermissionForm({ ...permissionForm, loading: false });
      }
    } else {
      const responseBody = await fetch(`${baseURL}/permission`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
      if (responseBody.ok) {
        const body = (await responseBody.json()) as ApiResponse<Permission>;
        setPermissionForm({ editData: null, visible: false, loading: false });
        setQuery(body.data?.Name || "");
      } else {
        console.log(await responseBody.json());
        setPermissionForm({ ...permissionForm, loading: false });
      }
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <div
        className={`w-full overflow-hidden ${
          !permissionForm.visible && "hidden"
        }`}
      >
        <PermissionForm
          hidePermissionForm={hidePermissionForm}
          handleFormSubmit={handleFormSubmit}
          permissionForm={permissionForm}
        />
      </div>
      <div
        className={`w-full overflow-hidden ${
          permissionForm.visible && "hidden"
        }`}
      >
        <div className="mb-4">
          <h1 className="text-xl font-medium text-gray-700">Permission</h1>
          <p className="text-gray-500">
            A list of permissions retrieved from a database.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="Search by name..."
            loading={loading}
            size="large"
            value={query}
            onChange={handleSearchChange}
            className="w-96"
            allowClear
          />
          <Button
            htmlType="button"
            type="primary"
            className="bg-[#1677ff]"
            size="large"
            onClick={() =>
              setPermissionForm({
                ...permissionForm,
                visible: true,
                editData: null,
              })
            }
          >
            Add Permission
          </Button>
        </div>
        <PermissionTable
          data={data?.rows || []}
          count={data?.count || 0}
          query={query}
          pageCount={Math.ceil((data?.count || 0) / 10) || 0}
          columns={columns}
          fetchData={fetchData}
        />
      </div>
    </>
  );
}
