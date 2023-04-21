"use client";

import { Select } from "antd";
import { Dispatch } from "react";

import { User } from "@/interface/user";
import StatusTag from "@/app/dashboard/user-configration/user/statusTag";

interface ModalPropeTypes {
  data: User | null;
  roles: string[];
  rolesLoading: boolean;
  selectedRoles: string[];
  setSelectedRoles: Dispatch<string[]>;
  
}

export default function UserRoleEditModalBody({
  data,
  roles,
  rolesLoading,
  selectedRoles,
  setSelectedRoles,
}: ModalPropeTypes) {

  return (
    <div className="bg-white w-full">
      <div className="flex justify-between mb-4 rounded-t sm:mb-5">
        <div className="text-lg text-gray-900 md:text-xl dark:text-white">
          <div className="flex items-center justify-start">
            <h3 className="font-semibold mr-2">{data?.UserName}</h3>{" "}
            <StatusTag status={data?.Status || "ACTIVE"} />
          </div>
          <p className="font-bold text-gray-400 text-sm">{data?.Email}</p>
        </div>
      </div>
      <dl>
        <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
          Roles
        </dt>
        <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
          <Select
            mode="multiple"
            size="large"
            placeholder="Please select"
            value={selectedRoles}
            onChange={(values) => {
              setSelectedRoles(values);
            }}
            style={{ width: "100%" }}
            options={roles?.map((r) => ({ value: r, label: r })) || []}
            loading={rolesLoading}
          />
        </dd>
      </dl>
    </div>
  );
}
