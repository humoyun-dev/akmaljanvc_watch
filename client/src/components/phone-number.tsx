import { cn } from "@/lib/utils";
import React from "react";
import PhoneInput from "react-phone-input-2";

interface Props {
  value: string;
  onChange: (phone: string) => void;
  error?: boolean;
  className?: string;
}

const PhoneNumber: React.FC<Props> = ({
  value,
  onChange,
  error,
  className,
}) => {
  return (
    <>
      <PhoneInput
        inputClass={cn(
          `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error && "border-red-500 ring-red-500"
          }`,
          className,
        )}
        country="uz"
        onlyCountries={["uz"]}
        specialLabel=""
        countryCodeEditable={false}
        masks={{ uz: "(..) ... - .. - .. " }}
        onChange={(phone) => onChange(phone)}
        value={value}
      />
    </>
  );
};

export default PhoneNumber;
