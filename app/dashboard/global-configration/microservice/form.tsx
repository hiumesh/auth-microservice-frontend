"use client"

import { Form, Input, Select, Button } from "antd";
import { useState, useCallback } from "react";
import useSWR from "swr";

import { Permission, PermissionListAPI } from "@/interface/permission";

import { useAuth } from "@/providers/auth/AuthProvider";
import { ApiResponse } from "@/interface/api";
import { Microservice } from "@/interface/microservice";
import { baseURL } from "@/app/config";

interface MicroserviceFormPropeTypes {
  microserviceForm: {
    visible: boolean;
    editData: null | Microservice;
    loading: boolean,
  },
  hideMicroserviceForm: Function;
  handleFormSubmit: (values: any) => void;
}

export default function MicroserviceForm({
  hideMicroserviceForm,
  microserviceForm,
  handleFormSubmit,

}: MicroserviceFormPropeTypes) {
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
    if (microserviceForm.editData) form.setFieldsValue({ name: microserviceForm.editData?.Name, description: microserviceForm.editData?.Description, permissions: microserviceForm.editData?.Permissions.map((per) => per.Name), endpoint: microserviceForm.editData.Endpoint })
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
        onClick={() => hideMicroserviceForm()}
      >
        Back
      </Button>
      <Form layout="vertical" onFinish={handleFormSubmit} form={form} initialValues={{ name: microserviceForm.editData?.Name, description: microserviceForm.editData?.Description, permissions: microserviceForm.editData?.Permissions.map((per) => per.Name), endpoint: microserviceForm.editData?.Endpoint }}>
        <div className="flex">
          <Form.Item className="flex-1 mr-2" name="name" label="Name" required>
            <Input placeholder="Microservice Name..." size="large"/>
          </Form.Item>
          <Form.Item
            className="flex-1 ml-2"
            name="permissions"
            label="Permissions"
            required
          >
            <Select
              showSearch
              placeholder="Microservice Permissions..."
              size="large"
              
              loading={isLoading}
              options={selectOptions}
              mode="multiple"
              onSearch={(value) => setPermissionName(value)}
            />
          </Form.Item>
        </div>
        <Form.Item name="endpoint" label="Endpoint" required>
          <Input placeholder="url..." />
        </Form.Item>

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
              loading={microserviceForm.loading}
            >
              {microserviceForm.editData ? "Update" : "Submit"}
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
