import { redirect } from "next/navigation";

export default function ViewUserPage() {
  redirect("/admin/users");
}
