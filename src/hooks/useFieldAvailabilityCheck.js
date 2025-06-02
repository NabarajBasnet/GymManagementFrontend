import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { setError, clearErrors } from "react-hook-form";

export const useFieldAvailabilityCheck = ({
  fieldValue,
  fieldName,
  apiUrl,
  onError,
  onSuccess,
  debounceTime,
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedQuery(fieldValue),
      debounceTime
    );
    return () => clearTimeout(handler);
  }, [fieldValue, debounceTime]);

  const { data, isLoading } = useQuery({
    queryKey: [fieldName, debouncedQuery],
    queryFn: async () => {
      try {
        const response = await fetch(`${apiUrl}?query=${debouncedQuery}`);
        const result = await response.json();

        if (result.exists) {
          onError(`${fieldName}`, {
            type: "manual",
            message: result.message || `${fieldName} already exists`,
          });
        } else {
          onSuccess(`${fieldName}`);
        }
        return result;
      } catch (error) {
        console.log("Error: ", error);
        return error;
      }
    },
    enabled: true,
  });
  return { data, isLoading };
};
