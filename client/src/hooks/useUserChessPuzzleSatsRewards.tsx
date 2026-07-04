import { useQuery } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../api/chessPuzzle";

export const useUserChessPuzzleSatsRewards = ({
  userID,
  cursor,
  enabled,
}: {
  userID: string;
  cursor: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["userChessPuzzleSatsRewards", userID, cursor],
    queryFn: () =>
      chessPuzzleAPI.getSatsRewardsByUser({ userID, limit: 10, cursor }),
    enabled,
  });
};
