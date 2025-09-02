import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">ホーム</h2>}
    >
      <Head title="ホーム" />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-main">たほ</h1>
      </div>
    </AuthenticatedLayout>
  );
}
