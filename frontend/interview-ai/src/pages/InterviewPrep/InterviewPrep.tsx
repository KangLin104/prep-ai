import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/QuestionCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Drawer from "../../components/Drawer";
import AiResponsePreview from "./components/AiResponsePreview";


type ExplanationType = {
  title: string;
  answer?: string;

  // Add other fields if needed
};

const InterviewPrep = () => {

  const { sessionID } = useParams<{ sessionID: string }>();

  const [sessionData, setSessionData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] =
    useState<boolean>(false);
  const [explanation, setExplanation] = useState<ExplanationType | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState<boolean>(false);

  const fetchSessionDetailById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_BY_ID(sessionID!)
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };
  const generateConceptualExplanation = async (question: string) => {
    try {
      setErrorMsg("");
      setExplanation(null);

      setIsLoading(true);
      setOpenLearnMoreDrawer(true);
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {question});
      if (response.data){
        setExplanation(response.data);
      }

    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Please try again.");
      console.log("Error generating explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleQuestionPinStatus = async (questionId: string) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );
  
      if (response.data && response.data.question) {
        fetchSessionDetailById();
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };
  
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicToFocus: sessionData?.topicToFocus,
          numberOfQuestions: 10,
        }
      )
      
      const generatedQuesitons = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionID,
          questions: generatedQuesitons,
        }
      );
      
      if (response.data) {
        toast.success("Questions added successfully!");
        fetchSessionDetailById();
      }

    } catch (error: any) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      }
      else {
        setErrorMsg("An unexpected error occurred while adding questions.");
      }
      
    }
    finally{
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionID) {
      fetchSessionDetailById();
    }

    return () => {};
  }, []);
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicToFocus={sessionData?.topicToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData?.updatedAt).format("Do MM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q&A</h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            } `}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data: any, index: number) => {
                return (
                  <motion.div
                    key={data._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      delay: index * 0.1,
                      damping: 10,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                  >
                    <>
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={() => {
                          generateConceptualExplanation(data.question);
                        }}
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />
                    </>

                    {!isLoading && sessionData?.questions?.length == index + 1 && (
                      <div className="flex items-center justify-center mt-5">
                        <button
                         className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                         disabled={isLoading || isUpdateLoader}
                         onClick = {uploadMoreQuestions}
                        >
                          {isUpdateLoader ? (
                            <SpinnerLoader />
                          ) : (
                              <LuListCollapse className="text-lg" />
                          )}{""}
                          Load More
                        </button>

                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div>
        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title={!isLoading && explanation?.title}
        >
          {errorMsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" /> {errorMsg}
            </p>
          )}
          {isLoading && <SpinnerLoader />}
          {!isLoading && explanation &&(
            <div className="max-w-4xl mx-auto h-[80vh] overflow-y-auto px-4">
              <AiResponsePreview content={explanation?.answer}/>
            </div>
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
