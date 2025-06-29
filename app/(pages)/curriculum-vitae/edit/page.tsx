import {
  listRoles,
  listSocials,
  listTechnologies,
  readCV,
  readProfile,
} from "@/app/actions";
import CurriculumVitaeEditForm from "./form";

export default async function CurriculumVitaeEdit() {
  const [CV, technologies, roles, socials, profile] = await Promise.all([
    readCV(),
    listTechnologies(),
    listRoles(),
    listSocials(),
    readProfile(),
  ]);
  return (
    <CurriculumVitaeEditForm
      {...{
        CV: CV,
        availableTechnologies: technologies,
        availableRoles: roles,
        socials: socials,
        profile: profile,
      }}
    />
  );
}
