import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions);
  return <pre>page</pre>;
}
