import {
  listRoles,
  listTechnologies,
  readCV,
} from "@/app/actions";
import CurriculumVitaeEditForm from "./component/form";

export default async function CurriculumVitaeEdit() {
  const [CV, technologies, roles] = await Promise.all([
    readCV(),
    listTechnologies(),
    listRoles(),
  ]);
  return (
    <CurriculumVitaeEditForm
      {...{
        CV: CV,
        availableTechnologies: technologies,
        availableRoles: roles,
      }}
    />
  );
}
