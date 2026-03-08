import { ChevronLeft, Loader2 } from "lucide-react";
import Card from "../../components/Card";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import FormTextArea from "../../components/FormTextArea";
import PageHeader from "../../components/PageHeader";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import Toast from "../../components/Toast";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import styles from "./CreateEventPage.module.css";

export default function CreateEventPage() {
  const {
    isEditMode,
    isLoadingEvent,
    form,
    errors,
    categories,
    canSubmit,
    isSubmitting,
    toast,
    setToast,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useCreateEvent();

  const pageTitle = isEditMode ? "Edit event" : "Create new event";

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Card withShadow>
        <PageHeader title={pageTitle} logoSize="medium" />

        {isEditMode && isLoadingEvent ? (
          <div className={styles.loading}>
            <Loader2 size={28} className={styles.loadingSpinner} />
            <p>Loading event...</p>
          </div>
        ) : (
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
              disabled={isEditMode}
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
              showCategoryIcons
            />

            <FormInput
              id="date"
              name="date"
              type="date"
              label="Date"
              value={form.date}
              onChange={handleChange}
              error={errors.date}
            />

            <FormInput
              id="time"
              name="time"
              type="time"
              label="Time"
              value={form.time}
              onChange={handleChange}
              error={errors.time}
            />

            <FormInput
              id="location"
              name="location"
              type="text"
              label="Location"
              value={form.location}
              placeholder="Enter the event venue or address"
              onChange={handleChange}
              error={errors.location}
            />

            <FormInput
              id="capacity"
              name="capacity"
              type="number"
              label="Capacity"
              value={form.capacity}
              placeholder="Maximum number of participants"
              onChange={handleChange}
              error={errors.capacity}
            />

            <FormInput
              id="price"
              name="price"
              type="number"
              label="Price ($)"
              value={form.price}
              placeholder="0 for free events"
              onChange={handleChange}
              error={errors.price}
              disabled={isEditMode}
            />

            <PrimaryButton type="submit" disabled={!canSubmit}>
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating event..."
                : isEditMode
                  ? "Save changes"
                  : "Create event"}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={handleCancel}
              leftIcon={<ChevronLeft size={18} />}
              fullWidth
            >
              Cancel
            </SecondaryButton>
          </form>
        )}
      </Card>
    </>
  );
}
