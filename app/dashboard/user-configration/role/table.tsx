import { Role } from "@/interface/role";

import { Button } from "antd";
import { Dispatch } from "react";

interface RoleTablePropeTypes {
  data: Role[];
  setRoleForm: Dispatch<{
    visible: boolean;
    editData: null | Role;
    loading: boolean,
  }>;
}

export default function RoleTable({ data, setRoleForm }: RoleTablePropeTypes) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((role) => (
            <tr
              key={role.Id}
              className="bg-white border-b"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {role.Name}
              </th>
             
              <td className="px-6 py-4 w-24">
                <Button htmlType="button" type="link" size="small" onClick={() => setRoleForm({ visible: true, editData: role, loading: false })}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
