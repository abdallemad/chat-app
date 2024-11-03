import { LucideProps, UserPlus } from "lucide-react";
import { LuSend } from "react-icons/lu";
export const Icons = {
  Logo: (props: LucideProps) => <LuSend className="h-8 w-8 text-indigo-500" />,
  UserPlus,
};

export type Icon = keyof typeof Icons;
