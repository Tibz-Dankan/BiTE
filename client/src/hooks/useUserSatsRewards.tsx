import { useQuery } from "@tanstack/react-query";
import { satsRewardAPI } from "../api/satsReward";

export const useUserSatsRewards = ({
  userID,
  cursor,
  enabled,
}: {
  userID: string;
  cursor: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["userSatsRewards", userID, cursor],
    queryFn: () => satsRewardAPI.getAllByUser({ userID, limit: 10, cursor }),
    enabled,
  });
};
