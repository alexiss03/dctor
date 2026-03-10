import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { SearchResult as SearchResultType } from "@/types/search";

type SearchResultProps = {
  data: SearchResultType;
  onSelect: (doctor: SearchResultType) => void;
};

export function SearchResult({ data, onSelect }: SearchResultProps) {
  return (
    <HealthcareBox
      data={data}
      fields={[
        { name: "photo" },
        { name: "name" },
        { name: "category" },
        { name: "location", icon: true },
        { name: "time", icon: true },
        { name: "rating" },
        { name: "insurance", label: true },
      ]}
      direction="column"
      actions={[
        // <Button key="save" size="medium">
        //   Save
        // </Button>,
        <Button
          key="book"
          variant="primary"
          size="medium"
          onClick={() => onSelect(data)}
        >
          Book
        </Button>,
      ]}
    />
  );
}
