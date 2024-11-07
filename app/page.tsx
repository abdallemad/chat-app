import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if(session) return redirect("/dashboard");
  if(!session) return redirect("/login");
  return <div>hello world</div>;
}
