import AddFriendButton from "@/app/(dashboard)/dashboard/add/AddFriendButton";

export default async function page() {
  return (
    <main className="pt-8 flex flex-col items-center">
      <h1 className="font-bold text-5xl mb-8">Add Friend</h1>
      <AddFriendButton />
    </main>
  );
}
