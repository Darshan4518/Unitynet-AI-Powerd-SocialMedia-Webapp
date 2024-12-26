"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const FormButton = ({ tittle }: { tittle: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r flex justify-center items-center from-purple-600 to-blue-600  hover:opacity-90"
      disabled={pending}
    >
      <p className="text-white">
        {pending ? <Loader2 className=" animate-spin size-4" /> : tittle}
      </p>
    </Button>
  );
};

export default FormButton;
