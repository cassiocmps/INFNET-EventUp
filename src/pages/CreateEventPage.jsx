import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BackIcon from "../assets/icons/BackIcon";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormTextArea from "../components/FormTextArea";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { eventService } from "../services/eventService";
import { PATHS } from "../routes/paths";
import styles from "./CreateEventPage.module.css";

const defaultForm = {
  title: "",
  description: "",
  category: "",
};

function validateForm({ title, description, category }) {
  const nextErrors = {
    title: "",
    description: "",
    category: "",
  };

  if (!title.trim()) {
    nextErrors.title = "Title is required.";
  } else if (title.trim().length < 3) {
    nextErrors.title = "Title must be at least 3 characters.";
  }

  if (!description.trim()) {
    nextErrors.description = "Description is required.";
  } else if (description.trim().length < 10) {
    nextErrors.description = "Description must be at least 10 characters.";
  }

  if (!category) {
    nextErrors.category = "Category is required.";
  }

  return nextErrors;
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { currentUser, isOrganizer } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate(PATHS.signin, {
        state: {
          errorMessage: "Please sign in to create an event.",
        },
      });
      return;
    }

    if (!isOrganizer) {
      navigate(PATHS.dashboard, {
        state: {
          errorMessage: "Only organizers can create events.",
        },
      });
      return;
    }
  }, [currentUser, isOrganizer, navigate]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await eventService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    loadCategories();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      Boolean(form.title && form.description && form.category) && !isSubmitting
    );
  }, [form, isSubmitting]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some((error) => Boolean(error));
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await eventService.createEvent({
        title: form.title,
        description: form.description,
        category: form.category,
      });

      navigate(PATHS.dashboard, {
        state: {
          successMessage: "Event created successfully!",
        },
      });
    } catch (error) {
      console.error("Create event error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

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
          onClick={() => navigate(PATHS.dashboard)}
          leftIcon={<BackIcon size={18} />}
          fullWidth
        >
          Cancel
        </SecondaryButton>
      </form>
    </Card>
  );
}
