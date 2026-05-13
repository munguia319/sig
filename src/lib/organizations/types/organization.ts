interface Organization {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  timezone?: string;
  logoURL?: string | null;
}

export default Organization;
