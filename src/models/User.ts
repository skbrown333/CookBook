export interface User {
  username: string;
  discriminator: string;
  uid: string;
  avatar?: string;
  links: string[];
  discord_id: string;
  email: string;
}
