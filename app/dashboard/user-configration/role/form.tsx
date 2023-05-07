"use client"

import { Form, Input, Select, Button } from "antd";
import { useState, useCallback } from "react";
import useSWR from "swr";

import { PermissionListAPI } from "@/interface/permission";

import { useAuth } from "@/providers/auth/AuthProvider";
import { Role } from "@/interface/role";
import { baseURL } from "@/app/config";

interface RoleFormPropeTypes {
  roleForm: {
    visible: boolean;
    editData: null | Role;
    loading: boolean,
  },
  hideRoleForm: Function;
  handleFormSubmit: (values: any) => void;
}

export default function RoleForm({
  hideRoleForm,
  roleForm,
  handleFormSubmit,

}: RoleFormPropeTypes) {
  const [permissionName, setPermissionName] = useState("");

  const { accessToken } = useAuth();
  const [form] = Form.useForm();

  const permissionFetcher = useCallback(
    (url: string) =>
      fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => {
        const responseBody = (await res.json()) as PermissionListAPI;
        return responseBody.data;
      }),
    [accessToken]
  );

  const { data: permissions, isLoading } = useSWR(
    `${baseURL}/permission?name=${permissionName}`,
    permissionFetcher
  );

  const fillForm = () => {
    if (roleForm.editData) form.setFieldsValue({ name: roleForm.editData?.Name, description: roleForm.editData?.Description, permissions: roleForm.editData?.Permissions.map((per) => per.Name)})
    else form.resetFields();
  }

  const selectOptions = permissions?.rows ? permissions.rows?.map((per) => ({
    label: per.Name,
    value: per.Name,
  })) : [];
  return (
    <div>
      <Button
        htmlType="button"
        type="dashed"
        className="mb-3"
        onClick={() => hideRoleForm()}
      >
        Back
      </Button>
      <Form layout="vertical" onFinish={handleFormSubmit} form={form} initialValues={{ name: roleForm.editData?.Name, description: roleForm.editData?.Description, permissions: roleForm.editData?.Permissions.map((per) => per.Name)}}>
        <div className="flex">
          <Form.Item className="flex-1 mr-2" name="name" label="Name" required>
            <Input placeholder="Role Name..." size="large"/>
          </Form.Item>
          <Form.Item
            className="flex-1 ml-2"
            name="permissions"
            label="Permissions"
            required
          >
            <Select
              showSearch
              placeholder="Role Permissions..."
              size="large"
              
              loading={isLoading}
              options={selectOptions}
              mode="multiple"
              onSearch={(value) => setPermissionName(value)}
            />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Description" required>
          <Input.TextArea placeholder="Description..." />
        </Form.Item>
        <div className="flex">
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className="bg-[#1677ff]"
              size="large"
              loading={roleForm.loading}
            >
              {roleForm.editData ? "Update" : "Submit"}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="button" type="link" size="large" onClick={fillForm}>
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
