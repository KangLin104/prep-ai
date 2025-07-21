import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateSessionForm = () => {

    const [formData, setFormData] = useState({
        role: "",
        topicToFocus: "",
        experience: "",
        questions: [],
        description: ""
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navagate = useNavigate();

    const handleChange = (key:any,value:any) =>{
        setFormData((prevData) => ({
            ...prevData,
            [key]: value
        }));
    }

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        const {role, experience, topicToFocus} = formData;

        if(!role || !experience || !topicToFocus) {
            setError("Role, Experience, and Topic to Focus are required.");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
                role,
                experience,
                topicToFocus,
                numberOfQuestions: 10,
            })

            const generatedQuestions = aiResponse.data

            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                ...formData,
                questions: generatedQuestions,
            });

            if (response.data?.session?._id) {
                navagate(`/interview-prep/${response.data?.session?._id}`);
            }
        } catch (error: any) {
            
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred while creating the session.");
            }
        }
        finally {
            setIsLoading(false);
        }

    }

  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
        <h3 className='text-lg font-semibold text-black'>
            Start a New Session
        </h3>
        <p className='text-sm text-gray-600 mt-[5px] mb-3'>
            Fill in the details below to create a new interview session.
        </p>

        <form onSubmit={handleCreateSession} className=''>
            <Input
                value= {formData.role}
                onChange={({target}) => handleChange("role", target.value)}
                label="Target Role"
                placeholder='e.g. Software Engineer, Data Scientist'
                type="text"
            />

            <Input
                value= {formData.experience}
                onChange={({target}) => handleChange("experience", target.value)}
                label="Yars of Experience"
                placeholder='e.g. 1 year, 2 yeas, 5+ years'
                type="number"
            />

            <Input
                value= {formData.topicToFocus}
                onChange={({target}) => handleChange("topicToFocus", target.value)}
                label="Topic To Focus On"
                placeholder='(Comma-seperated e.g. Data Structures, React, Python)'
                type="text"
            />

            <Input
                value= {formData.description}
                onChange={({target}) => handleChange("description", target.value)}
                label="description"
                placeholder='(Any goals or specific areas you want to focus on)'
                type="text"
            />

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

            <button type="submit" className='btn-primary w-full mt-2' disabled={isLoading}>
                {isLoading && <SpinnerLoader/>}Create Sessions
            </button>
        </form>
    </div>
  )
}

export default CreateSessionForm