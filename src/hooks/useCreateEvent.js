import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { eventService } from "../services/eventService";
import { PATHS } from "../routes/paths";

const defaultForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  capacity: "",
};

function validateForm({
  title,
  description,
  category,
  date,
  time,
  location,
  capacity,
}) {
  const nextErrors = {
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
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

  if (!date) {
    nextErrors.date = "Date is required.";
  }

  if (!time) {
    nextErrors.time = "Time is required.";
  }

  if (!location.trim()) {
    nextErrors.location = "Location is required.";
  }

  if (!capacity) {
    nextErrors.capacity = "Capacity is required.";
  } else if (Number(capacity) < 1) {
    nextErrors.capacity = "Capacity must be at least 1.";
  }

  return nextErrors;
}

export function useCreateEvent() {
  const navigate = useNavigate();
  const { currentUser, isOrganizer } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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
        setToast({
          message: "Failed to load categories. Please try again.",
          type: "error",
        });
      }
    }

    loadCategories();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      Boolean(
        form.title &&
        form.description &&
        form.category &&
        form.date &&
        form.time &&
        form.location &&
        form.capacity,
      ) && !isSubmitting
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
        date: form.date,
        time: form.time,
        location: form.location,
        capacity: Number(form.capacity),
        organizerId: currentUser?.id,
        organizerName: currentUser?.name,
      });

      navigate(PATHS.dashboard, {
        state: {
          successMessage: "Event created successfully!",
        },
      });
    } catch (error) {
      setToast({
        message: error.message || "Failed to create event. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate(PATHS.dashboard);
  }

  return {
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
  };
}
