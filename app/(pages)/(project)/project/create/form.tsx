"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ComboboxItem,
  ProjectSchema,
  Role,
  Technology,
  type Project,
} from "@/types/types";
import {
  createProject,
  createRole,
  createTechnology,
  listTechnologies,
} from "@/app/actions";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/custom/rich-text";
import ImageUpload from "@/components/custom/image-upload";
import BadgeCombobox from "@/components/custom/badge-combobox";
import MonthPicker from "@/components/custom/month-picker";
import { toast } from "sonner";

export default function ProjectCreateForm({
  technologies,
  roles,
}: {
  technologies: Technology[];
  roles: Role[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Project>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
      shortDescription: "",
      bannerUrl: "",
      imageUrl: [""],
      technologies: [],
      role: [],
      repositoryUrl: "",
      liveUrl: "",
      isFeatured: false,
      createdAt: new Date(),
    },
  });

  const handleAddNewTechnology = async (item: ComboboxItem) => {
    try {
      const formData = new FormData();
      formData.append("name", item.label);
      await createTechnology(formData);
      await listTechnologies();
    } catch (error) {
      console.error("Failed to create technology:", error);
      throw error;
    }
  };

  const handleTechnologiesChange = (newTechnologies: ComboboxItem[]) => {
    const formattedTechnologies = newTechnologies.map((tech) => ({
      name: tech.label,
    }));
    form.setValue("technologies", formattedTechnologies);
  };

  const addImageUrl = () => {
    form.setValue("imageUrl", [...form.getValues("imageUrl"), ""]);
  };

  const removeImageUrl = (index: number) => {
    const currentUrls = [...form.getValues("imageUrl")];
    currentUrls.splice(index, 1);
    form.setValue("imageUrl", currentUrls);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...form.getValues("imageUrl")];
    newUrls[index] = value;
    form.setValue("imageUrl", newUrls);
  };

  const handleRolesChange = (newRoles: ComboboxItem[]) => {
    const formattedRoles = newRoles.map((role) => ({
      name: role.label,
    }));
    form.setValue("role", formattedRoles);
  };

  const handleAddNewRole = async (item: ComboboxItem) => {
    try {
      const formData = new FormData();
      formData.append("name", item.label);
      await createRole(formData);
    } catch (error) {
      console.error("Failed to create role:", error);
      throw error;
    }
  };

  async function onSubmit(values: Project) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("shortDescription", values.shortDescription);
      if (values.bannerUrl) formData.append("bannerUrl", values.bannerUrl);
      formData.append("imageUrl", JSON.stringify(values.imageUrl));
      formData.append("technologies", JSON.stringify(values.technologies));
      formData.append("role", JSON.stringify(values.role));
      if (values.repositoryUrl)
        formData.append("repositoryUrl", values.repositoryUrl);
      if (values.liveUrl) formData.append("liveUrl", values.liveUrl);
      formData.append("isFeatured", values.isFeatured.toString());
      if (values.createdAt)
        formData.append("createdAt", values.createdAt.toISOString());

      const slug = await createProject(formData);
      router.push(`/project/${slug}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Date</FormLabel>
                  <FormControl>
                    <MonthPicker
                      currentMonth={field.value}
                      onMonthChange={field.onChange}
                      maxMonth={new Date()}
                    />
                  </FormControl>
                  <FormDescription>
                    When this project was created or started
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief description for cards and previews"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Brief description shown in project cards
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of your project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Media */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Media</h2>

          <FormField
            control={form.control}
            name="bannerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image *</FormLabel>
                <FormDescription>
                  Main banner image for the project
                </FormDescription>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Images</FormLabel>
                  <FormDescription className="mb-4">
                    Add multiple images to showcase your project
                  </FormDescription>
                  <FormControl>
                    <div className="w-full">
                      <div className="space-y-2 flex flex-col md:flex-row gap-2 overflow-x-auto">
                        {field.value.map((url, index) => (
                          <div
                            key={index}
                            className="flex gap-2 mb-2 items-end"
                          >
                            <ImageUpload
                              value={url}
                              onDelete={() => removeImageUrl(index)}
                              onChange={(value) => updateImageUrl(index, value)}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={index === 0}
                              size="sm"
                              onClick={() => removeImageUrl(index)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageUrl}
                        icon={Plus}
                        className="w-fit"
                        iconPlacement="left"
                      >
                        Add Image
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y">
          <h2 className="text-xl font-semibold">Technologies *</h2>
          <FormField
            control={form.control}
            name="technologies"
            render={() => (
              <FormItem>
                <FormDescription className="mb-2">
                  Add the technologies and tools used in this project. You can
                  select existing ones or create new ones by typing and pressing
                  Enter.
                </FormDescription>
                <FormControl>
                  <BadgeCombobox
                    value={form.getValues("technologies")?.map((tech) => ({
                      value: tech.name,
                      label: tech.name,
                    }))}
                    data={technologies.map((tech) => ({
                      value: tech.name,
                      label: tech.name,
                    }))}
                    onChange={handleTechnologiesChange}
                    onAddNew={handleAddNewTechnology}
                    placeholder="Select technologies..."
                    searchPlaceholder="Search technologies..."
                    emptyMessage="No technologies found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Roles */}
        <div className="space-y">
          <h2 className="text-xl font-semibold">Roles *</h2>
          <FormField
            control={form.control}
            name="role"
            render={() => (
              <FormItem>
                <FormDescription className="mb-2">
                  Add your roles and responsibilities in this project. You can
                  select existing ones or create new ones by typing and pressing
                  Enter.
                </FormDescription>
                <FormControl>
                  <BadgeCombobox
                    value={form.getValues("role")?.map((role) => ({
                      value: role.name,
                      label: role.name,
                    }))}
                    data={roles.map((role) => ({
                      value: role.name,
                      label: role.name,
                    }))}
                    onChange={handleRolesChange}
                    onAddNew={handleAddNewRole}
                    placeholder="Select roles..."
                    searchPlaceholder="Search roles..."
                    emptyMessage="No roles found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Links */}
        <div className="space-y">
          <h2 className="text-xl font-semibold">Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to your project&apos;s source code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://myproject.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to the live/deployed version
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Settings</h2>

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Project</FormLabel>
                  <FormDescription>
                    Mark this project as featured to highlight it on your
                    portfolio
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
