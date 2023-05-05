"use client";

import { useState } from "react";
import { baseURL } from "@/app/config";

import Search from "@/ui/search";
import MicroserviceTable from "./table";
import { Microservice } from "@/interface/microservice";
import { Button } from "antd";
import MicroserviceForm from "./form";
import { useAuth } from "@/providers/auth/AuthProvider";
import { ApiResponse } from "@/interface/api";

interface ContainerPropeType {
  initialData: Microservice[];
}

export default function Container({ initialData }: ContainerPropeType) {
  const { accessToken } = useAuth();
  const [microservices, setMicroservices] = useState(initialData);

  const [query, setQuery] = useState("");
  const [microserviceForm, setMicroserviceForm] = useState<{
    visible: boolean;
    editData: null | Microservice;
    loading: boolean;
  }>({ visible: false, editData: null, loading: false });
  const filteredRoles = microservices.filter((microservice) =>
    microservice.Name.toLocaleLowerCase().includes(query)
  );

  const hideMicroserviceForm = () => setMicroserviceForm({ ...microserviceForm, visible: false });
  const handleFormSubmit = async (values: any) => {
    setMicroserviceForm({ ...microserviceForm, loading: true });
    if (microserviceForm.editData) {
      const responseBody = await fetch(
        `${baseURL}/microservice/${microserviceForm.editData.Id}`,
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
        const body = (await responseBody.json()) as ApiResponse<Microservice>;
        const role = {
          ...body.data,
          Permissions: body.data?.Permissions.map((per) => ({ Name: per })),
        };
        const roleIdx = microservices.findIndex((microservice) => microservice.Id === body.data?.Id);
        const newRoles = [...microservices];
        if (typeof roleIdx === "number")
          newRoles[roleIdx] = role as unknown as Microservice;
        setMicroservices(newRoles);
        setMicroserviceForm({ editData: null, visible: false, loading: false });
      } else {
        setMicroserviceForm({ ...microserviceForm, loading: false });
      }
    } else {
      const responseBody = await fetch(`${baseURL}/microservice`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
      if (responseBody.ok) {
        const body = (await responseBody.json()) as ApiResponse<Microservice>;
        const role = {
          ...body.data,
          Permissions: body.data?.Permissions.map((per) => ({ Name: per })),
        };
        setMicroservices([...microservices, role] as unknown as Microservice[]);
        setMicroserviceForm({ editData: null, visible: false, loading: false });
      } else {
        setMicroserviceForm({ ...microserviceForm, loading: false });
      }
    }
  };

  if (microserviceForm.visible)
    return (
      <div className="w-full overflow-hidden">
        <MicroserviceForm
          microserviceForm={microserviceForm}
          handleFormSubmit={handleFormSubmit}
          hideMicroserviceForm={hideMicroserviceForm}
        />
      </div>
    );

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-medium text-gray-700">Microservices</h1>
        <p className="text-gray-500">
          A list of microservices retrieved from a database.
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
            setMicroserviceForm({ ...microserviceForm, visible: true, editData: null })
          }
        >
          Add Microservice
        </Button>
      </div>

      <MicroserviceTable setMicroserviceForm={setMicroserviceForm} data={filteredRoles} />
    </div>
  );
}
