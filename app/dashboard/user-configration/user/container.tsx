"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { Dropdown, MenuProps, Modal } from "antd";
import { Column } from "react-table";
import useSWR from "swr";

import { useAuth } from "@/providers/auth/AuthProvider";
import { baseURL } from "@/app/config";
import { UserListAPI, UserList, User } from "@/interface/user";
import { Role } from "@/interface/role";
import { ApiResponse } from "@/interface/api";
import Search from "@/ui/search";

import StatusTag from "./statusTag";
import RoleTag from "./roleTag";
import UsersTable from "./table";
import UserRoleEditModalBody from "./userRoleEditModalBody";

export default function Container({
  initialTableData,
}: {
  initialTableData: UserList | undefined;
}) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<UserList | undefined>(initialTableData);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [editRoleModal, setEditRoleModal] = useState<{
    visible: boolean;
    user: User | null;
    loading: boolean;
  }>({ visible: false, user: null, loading: false });
  const [selectedRoles, setSelectedRoles] = useState<any[]>(
    editRoleModal.user?.Roles.map((r) => ({ value: r.Name })) || []
  );

  const suspendUser = useCallback(
    (user: User) => {
      fetch(`${baseURL}/user/suspend/${user.Id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        if (res.ok) {
          const newData = { ...data } as UserList;
          let updatedRowIndex = 0;
          const updateRow = newData.rows?.find((r, idx) => {
            updatedRowIndex = idx;
            return r.Id === user.Id;
          }) as User;
          updateRow.Status = "SUSPENDED";
          (newData.rows as User[])[updatedRowIndex] = updateRow;

          setData(newData);
        }
      });
    },
    [accessToken, data]
  );

  const activateUser = useCallback(
    (user: User) => {
      fetch(`${baseURL}/user/activate/${user.Id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        if (res.ok) {
          const newData = { ...data } as UserList;
          let updatedRowIndex = 0;
          const updateRow = newData.rows?.find((r, idx) => {
            updatedRowIndex = idx;
            return r.Id === user.Id;
          }) as User;
          updateRow.Status = "ACTIVE";
          (newData.rows as User[])[updatedRowIndex] = updateRow;

          setData(newData);
        }
      });
    },
    [accessToken, data]
  );

  const columns: readonly Column[] = useMemo(
    () => [
      {
        Header: "User",
        accessor: "UserName",
        Cell: (cel) => {
          const rowData = cel.row.original as User;

          return (
            <div className="flex items-center py-4 text-gray-900 whitespace-nowrap">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image
                  className=""
                  width={40}
                  height={40}
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                  alt="Jese image"
                />
              </div>

              <div className="pl-3">
                <div className="text-base font-semibold">
                  {rowData.UserName}
                </div>
                <div className="font-normal text-gray-500">{rowData.Email}</div>
              </div>
            </div>
          );
        },
        width: 300,
      },
      {
        Header: "Roles",
        accessor: "Roles",
        Cell: (cel) => {
          const rowData = cel.row.original as User;

          return (
            <div className="flex items-center flex-row flex-wrap w-full h-full relative -left-2">
              {rowData.Roles.map((role) => (
                <RoleTag key={role.Name} role={role.Name} />
              ))}
            </div>
          );
        },
        width: 350,
      },
      {
        Header: "Status",
        accessor: "Status",
        Cell: (cel) => {
          return (
            <div className="flex items-center h-full">
              <StatusTag status={cel.value} />
            </div>
          );
        },
      },
      {
        Header: "Action",
        Cell: (cel) => {
          const rowData = cel.row.original as User;
          const items: MenuProps["items"] = [
            {
              label: "Edit Role",
              key: "1",
              onClick: () =>
                setEditRoleModal({
                  user: rowData,
                  visible: true,
                  loading: false,
                }),
            },
            {
              label: "Activate",
              key: "2",
              disabled: !(rowData.Status === "SUSPENDED"),
              onClick: () => activateUser(rowData),
            },
            {
              label: "Suspend",
              key: "3",
              disabled: !(rowData.Status !== "SUSPENDED"),
              danger: true,
              onClick: () => suspendUser(rowData),
            },
          ];
          return (
            <Dropdown menu={{ items }}>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </Dropdown>
          );
        },
      },
    ],
    [activateUser, suspendUser]
  );

  const roleFetcher = useCallback(
    (url: string) =>
      fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => {
        const responseBody = (await res.json()) as ApiResponse<string[]>;
        return responseBody.data;
      }),
    [accessToken]
  );

  const updateRole = useCallback(
    (user: User, roles: string[]) => {
      setEditRoleModal({ ...editRoleModal, loading: true });
      fetch(`${baseURL}/user/role/${user.Id}`, {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ roles }),
      }).then((res) => {
        if (res.ok) {
          const newData = { ...data } as UserList;
          let updatedRowIndex = 0;
          const updateRow = newData.rows?.find((r, idx) => {
            updatedRowIndex = idx;
            return r.Id === user.Id;
          }) as User;
          updateRow.Roles = roles.map((r) => ({ Name: r })) as Role[];
          (newData.rows as User[])[updatedRowIndex] = updateRow;

          setData(newData);
          setEditRoleModal({ user: null, visible: false, loading: false });
        }
      });
    },
    [data, editRoleModal, accessToken]
  );

  const fetchData = useCallback(
    async (filter: { pageIndex: number; pageSize: number; email: string }) => {
      const { pageIndex, pageSize, email = "" } = filter;
      setLoading(true);
      const response = await fetch(
        `${baseURL}/user?limit=${pageSize}&offset=${
          pageSize * pageIndex
        }&email=${email}`,
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
      const responseBody = (await response.json()) as UserListAPI;
      if (responseBody.success && responseBody.data) setData(responseBody.data);
    },
    [accessToken]
  );

  const {
    data: roles,
    isLoading,
  } = useSWR(`${baseURL}/role/names`, roleFetcher);

  useEffect(() => {
    setSelectedRoles(editRoleModal.user?.Roles.map((r) => ({ value: r.Name })) || []);
  }, [editRoleModal.user]);

  return (
    <div className="w-full overflow-hidden">
      <Search loading={loading} setQueryE={setQuery} />
      <UsersTable
        data={data?.rows || []}
        count={data?.count || 0}
        query={query}
        pageCount={Math.ceil((data?.count || 0) / 10) || 0}
        columns={columns}
        fetchData={fetchData}
      />
     
      <Modal
        title="Update Role"
        open={editRoleModal.visible}
        onOk={() => updateRole(editRoleModal.user as User, selectedRoles)}
        confirmLoading={editRoleModal.loading}
        onCancel={() =>
          setEditRoleModal({ visible: false, user: null, loading: false })
        }
        okButtonProps={{ className: "bg-blue-700" }}
        okText="Update"
      >
        <UserRoleEditModalBody
          data={editRoleModal.user}
          roles={roles as string[]}
          rolesLoading={isLoading}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
        />
      </Modal>
    </div>
  );
}
