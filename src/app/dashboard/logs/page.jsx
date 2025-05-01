'use client';

import { useEffect } from "react";
import toast from "react-hot-toast";

const LearnAggregation = () => {

  const getData = async () => {
    try {
      const response = await fetch('https://7232397b19d1ad937691d5b90ab2d795.serveo.net/api/aggregation');

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full flex h-100vh items-center justify-center">
      <h1 className="text-2xl text-center font-bold">Learn Aggregation</h1>
      <input
      type="timezone"
      />
    </div>
  );
}

export default LearnAggregation;
