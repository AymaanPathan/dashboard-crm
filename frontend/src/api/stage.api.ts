import axiosSetup from "@/utils/axiosSetup";

export const getAllStagesOfOrgApi = async () => {
  try {
    const res = await axiosSetup.get("/stages/all");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching stages:", error);
    throw error;
  }
};
