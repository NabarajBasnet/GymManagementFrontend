'use client';

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import toast from "react-hot-toast";

const LearnAggregation = () => {

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/applogs');

      const resBody = await response.json();
      console.log(resBody);
      if (!response.ok) {
        toast.error(resBody.message || 'Failed to fetch data');
      } else {
        toast.success('Data fetched successfully');
        console.log(resBody);
      };

    } catch (error) {
      console.error("Error in getData:", error);
    };
  };

  return (
    <div className="w-full flex h-100vh items-center justify-center">
      <h1 className="text-2xl text-center font-bold">App Logs</h1>
      <Button onClick={() => getData()}>Get Logs</Button>
    </div>
  );
}

export default LearnAggregation;
