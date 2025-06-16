import SurveyService from "../../_lib/survey";

export default async function Head({ params }: { params: { id: string } }) {
	const survey = await SurveyService.getSurvey(params.id);

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
