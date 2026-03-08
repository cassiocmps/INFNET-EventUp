import BackIcon from "../../assets/icons/BackIcon";
import Card from "../../components/Card";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import FormTextArea from "../../components/FormTextArea";
import PageHeader from "../../components/PageHeader";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { useCreateEvent } from "./useCreateEvent";
import styles from "./CreateEventPage.module.css";

export default function CreateEventPage() {
  const {
    form,
    errors,
    categories,
    canSubmit,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useCreateEvent();

  return (
    <Card withShadow>
      <PageHeader
        title="Create new event"
        subtitle="Fill in the details to create an event for your community."
        logoSize="medium"
      />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormInput
          id="title"
          name="title"
          type="text"
          label="Event title"
          value={form.title}
          placeholder="Enter a clear and concise title"
          onChange={handleChange}
          error={errors.title}
        />

        <FormTextArea
          id="description"
          name="description"
          label="Event description"
          value={form.description}
          placeholder="Describe what participants can expect from this event"
          onChange={handleChange}
          error={errors.description}
          rows={6}
        />

        <FormSelect
          id="category"
          name="category"
          label="Category"
          value={form.category}
          placeholder="Select a category"
          onChange={handleChange}
          error={errors.category}
          options={categories}
        />

        <PrimaryButton type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Creating event..." : "Create event"}
        </PrimaryButton>

        <SecondaryButton
          type="button"
          onClick={handleCancel}
          leftIcon={<BackIcon size={18} />}
          fullWidth
        >
          Cancel
        </SecondaryButton>
      </form>
    </Card>
  );
}
