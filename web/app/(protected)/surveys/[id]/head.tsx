import { getSurvey } from "../../../_lib/api";

export default async function Head({ params }: { params: { id: string } }) {
	const survey = await getSurvey(params.id);

	return (
		<>
			<title>
				{survey?.name
					? `${survey.name} | SurveyMaster`
					: "Survey | SurveyMaster"}
			</title>
		</>
	);
}
