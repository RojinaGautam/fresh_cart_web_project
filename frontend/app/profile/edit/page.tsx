import { redirect } from "next/navigation";

export default function EditProfileRedirect() {
  redirect("/dashboard/profile/edit");
}
