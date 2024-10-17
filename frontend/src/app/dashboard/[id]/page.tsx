import React from "react";
import UserCarDetail from "./_components/UserCarDetail";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <UserCarDetail tokenId={parseInt(id)}/>
    </div>
  );
};
