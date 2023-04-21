import { useRouter } from "next/router";
import { MemberService } from "../lib/services/MemberService";
import useSWR from "swr";
import { UserRole } from "../lib/models/User";

interface IsAdminProps {
  children: React.ReactNode;
}

/**
 * Renders `children` if the user is an admin or owner of the project.
 *
 * @param {IsAdminProps} props - The component props.
 * @param {JSX.Element} props.children - The children to render.
 * @return {JSX.Element | null} The rendered component, or null if the user is not authorized.
 */

function AdminOrOwner({ children }: IsAdminProps): JSX.Element | null {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    data: userInfo,
    isLoading,
    error,
  } = useSWR(MemberService.myInfo(projectId));

  if (isLoading || error) {
    return null;
  }

  if (
    userInfo?.data.role === UserRole.ADMIN ||
    userInfo?.data.role === UserRole.OWNER
  ) {
    return <>{children}</>;
  }

  return null;
}

export default AdminOrOwner;
