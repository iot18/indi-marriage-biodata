import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Flatten and filter form data by section
function getSectionFields(formSchema, formData) {
  const result = {};

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
      years--;
      months += 12;
    }

    return `${years} years ${months} months`;
  };

  for (const section in formSchema) {
    const fields = [];
    for (const field of formSchema[section]) {
      const value = formData[section]?.[field.name];

      if (value && value !== "" && value !== "0") {
        const processedValue = processSpecialFields(field.name, value);
        fields.push({ label: field.label, value: processedValue });

        // ⏱️ Add calculated age next to DOB
        if (field.name === "dob") {
          const ageStr = calculateAge(value);
          fields.push({ label: "Age", value: ageStr });
        }
      }
    }

    if (fields.length) result[section] = fields;
  }

  return result;
}

function processSpecialFields(fieldName, value) {
  if (typeof value === "string" && value.length > 30 && value.includes(",")) {
    return value
      .split(",")
      .map((item) => item.trim())
      .join("\n");
  }

  if (fieldName === "dob") {
    console.log(value);
    const date = new Date(value);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  }

  return value;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 4,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#0747A6",
    color: "#FFFFFF",
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  leftColumn: {
    flex: 3,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 2,
    paddingLeft: 1,
    alignItems: "center",
  },
  section: {
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#FFFFFF",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
    marginLeft: 2,
  },
  labelContainer: {
    width: 130,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  label: {
    color: "#FFFFFF",
    textAlign: "right",
  },
  colon: {
    width: 6,
    textAlign: "center",
    color: "#FFFFFF",
    marginLeft: 4,
    marginRight: 4,
  },
  value: {
    flex: 1,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    color: "#FFFFFF",
  },
  imageBlock: {
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 160, // Lower width as needed
    aspectRatio: 3 / 4, // Width:Height ratio
    objectFit: "cover",
    borderRadius: 2,
  },
  profile3image: {
    width: 100, // Lower width as needed
    aspectRatio: 3 / 4, // Width:Height ratio
    objectFit: "cover",
    borderRadius: 2,
  },
  familyImage: {
    width: 200, // Lower width as needed
    aspectRatio: 5 / 3, // Width:Height ratio
    objectFit: "cover",
    borderRadius: 2,
  },
  noImagesText: {
    marginTop: 20,
    fontSize: 6,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  header: {
    marginBottom: 12,
    alignItems: "center",
  },
  headerText: {
    fontSize: 4,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
  },
  logo: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 10,
  },
  footerText: {
    fontSize: 8,
    marginBottom: 4,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  footerTextLink: {
    fontSize: 8,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
});

const IMAGE_LABELS = {
  profile1: "Profile Photo",
  profile2: "Full Length Photo",
  profile3: "Family Photo",
  family: "Group Photo",
  nakshatra: "Horoscope Chart",
};

const MyPdfDocument = ({ formSchema, formData, images, logoSrc, settings }) => {
  const sectionFields = getSectionFields(formSchema, formData);
  const imageEntries = Object.entries(images).filter(([_, src]) => !!src);

  const primaryColor = settings?.primaryColor || "#2b8a3e";

  return (
    <Document>
      <Page size="A4" style={[styles.page, { backgroundColor: primaryColor }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Om Namah Shivaya</Text>
          {logoSrc && <Image src={logoSrc} style={styles.logo} />}
          <Text style={styles.titleText}>Bio Data</Text>
        </View>

        <View style={styles.container}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {Object.entries(sectionFields).map(([sectionKey, fields]) => (
              <View key={sectionKey} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {sectionKey.replace(/_/g, " ").toUpperCase()}
                </Text>
                {fields.map(({ label, value }, index) => (
                  <View key={index} style={styles.fieldRow}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>{label}</Text>
                    </View>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.rightColumn}>
            {imageEntries.length === 0 ? (
              <Text style={styles.noImagesText}>No Images Provided</Text>
            ) : (
              imageEntries.map(([key, src]) => (
                <View key={key} style={styles.imageBlock}>
                  <Image
                    src={src}
                    style={
                      key === "family"
                        ? styles.familyImage
                        : key == "profile3"
                        ? styles.profile3image
                        : styles.image
                    }
                  />
                </View>
              ))
            )}
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.footerText}>Created at</Text>
          <Text style={styles.footerTextLink}>
            https://indi-marriage-biodata.netlify.app/
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyPdfDocument;
