import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import FormRow from "../../ui/FormRow";
import { Textarea } from "../../ui/Textarea";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  // Verificăm dacă formularul va fi utilizat pentru a adăuga o cabană nouă sau pentru a edita una existentă
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId); // Determină dacă este sesiune de editare
  const { register, handleSubmit, reset, getValues, formState, watch } =
    useForm({
      // Setăm valorile implicite pentru formulare în funcție de sesiune (editare sau creare)
      defaultValues: isEditSession ? editValues : {},
    });

  // Extragem erorile de validare din State-ul formularului
  const { errors } = formState;

  // Hook-uri pentru crearea și editarea cabanei
  const { createCabin, isCreating } = useCreateCabin();
  const { editCabin, isEditing } = useEditCabin();
  const isWorking = isCreating || isEditing; // Indicator pentru starea de lucru (creare sau editare)

  // Funcție pentru gestionarea submit-ului formularului
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0]; // Verificăm imaginea
    if (isEditSession) {
      // Dacă este sesiune de editare, apelăm editCabin
      editCabin(
        { newCabinData: { ...data, image: image }, id: editId },
        {
          onSuccess: (data) => {
            reset(); // Resetăm formularul
            onCloseModal?.(); // Închidem modalul dacă este prezent
          },
        }
      );
    } else {
      // Dacă este sesiune de creare, apelăm createCabin
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }

  // Gestionarea erorilor de validare
  function onError(erros) {
    console.log(erros); // Afișează erorile în consolă
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1!",
            },
          })}
        />
      </FormRow>
      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1!",
            },
          })}
        />
      </FormRow>
      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            // Pentru validare putem scrie propriile functii customizate de validare. Functia primeste ca argument valoarea curenta a input-ului.
            // watch("regularPrice") → Se asigură că regularPrice este actualizat imediat ce utilizatorul modifică valoarea.
            validate: (value) => {
              const regularPriceValue = Number(watch("regularPrice")); // Convertim la număr
              const discountValue = Number(value);

              return (
                discountValue <= regularPriceValue ||
                "Discount should be less than the regular price"
              );
            },
            // getValues - obtine un obiect cu toate valorile form-ului
            // value <= getValues().regularPrice ||
            // "Discount should be less than the regular price",
          })}
        />
      </FormRow>
      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          disabled={isWorking}
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* Styled Components aplică automat toate props-urile HTML pe elementul de bază  // Props-uri HTML = Atribute native HTML*/}
        <Button
          variation="secondary"
          type="reset"
          // Luam in calcul reutilizarea form-ului in afara Modal.
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
