import { useQuery } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../api/chessPuzzle";

export const useUserClaimableChessPuzzles = ({
  userID,
  cursor,
  enabled,
}: {
  userID: string;
  cursor: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["claimableChessPuzzles", userID, cursor],
    queryFn: () =>
      chessPuzzleAPI.getClaimablePuzzles({ userID, limit: 10, cursor }),
    enabled,
  });
};
