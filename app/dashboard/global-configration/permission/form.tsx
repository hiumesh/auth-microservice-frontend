"use client";

import { Form, Input, Select, Button } from "antd";
import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";

import { Permission } from "@/interface/permission";

import { useAuth } from "@/providers/auth/AuthProvider";
import { ApiResponse } from "@/interface/api";
import { baseURL } from "@/app/config";
import { MicroserviceListAPI } from "@/interface/microservice";

interface PermissionFormPropeTypes {
  permissionForm: {
    visible: boolean;
    editData: null | Permission;
    loading: boolean;
  };
  hidePermissionForm: Function;
  handleFormSubmit: (values: any) => void;
}

export default function PermissionForm({
  hidePermissionForm,
  permissionForm,
  handleFormSubmit,
}: PermissionFormPropeTypes) {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();

  const microserviceFetcher = useCallback(
    (url: string) =>
      fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => {
        const responseBody = (await res.json()) as MicroserviceListAPI;
        return responseBody.data;
      }),
    [accessToken]
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

  const { data: microservices, isLoading } = useSWR(
    `${baseURL}/microservice`,
    microserviceFetcher
  );

  const { data: roles, isLoading: roleFetcherLoading } = useSWR(
    `${baseURL}/role/names`,
    roleFetcher
  );

  const fillForm = useCallback(() => {
    if (permissionForm.editData)
      form.setFieldsValue({
        name: permissionForm.editData?.Name,
        description: permissionForm.editData?.Description,
        roles: permissionForm.editData?.Roles.map((r) => r.Name),
        microservices: permissionForm.editData?.Microservices.map((m) => m.Name)
      });
    else form.resetFields();
  }, [form, permissionForm.editData]);

  useEffect(() => {
    fillForm();
  }, [fillForm, permissionForm.editData])

  return (
    <div>
      <Button
        htmlType="button"
        type="dashed"
        className="mb-3"
        onClick={() => hidePermissionForm()}
      >
        Back
      </Button>
      <Form
        layout="vertical"
        onFinish={handleFormSubmit}
        form={form}
      >
        <Form.Item name="name" label="Name" required>
          <Input placeholder="Microservice Name..." size="large" />
        </Form.Item>
        <div className="flex">
          <Form.Item className="flex-1 mr-2" name="roles" label="Roles">
            <Select
              showSearch
              placeholder="Permissions Roles..."
              size="large"
              loading={roleFetcherLoading}
              options={(roles || []).map((r) => ({
                label: r,
                value: r,
              }))}
              mode="multiple"
            />
          </Form.Item>

          <Form.Item
            className="flex-1 ml-2"
            name="microservices"
            label="Microservices"
          >
            <Select
              showSearch
              placeholder="Permissions Microservies..."
              size="large"
              loading={isLoading}
              options={(microservices || []).map((per) => ({
                label: per.Name,
                value: per.Name,
              }))}
              mode="multiple"
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
              loading={permissionForm.loading}
            >
              {permissionForm.editData ? "Update" : "Submit"}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="button"
              type="link"
              size="large"
              onClick={fillForm}
            >
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
