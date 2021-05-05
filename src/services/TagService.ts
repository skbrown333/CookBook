import { Tag } from "../models/Tag";

const tag1: Tag = {
  _id: "tag1",
  value: "falcon",
  label: "falcon",
};

const tag2: Tag = {
  _id: "tag2",
  value: "marth",
  label: "marth",
};
const tag3: Tag = {
  _id: "tag3",
  value: "throw",
  label: "throw",
};
const tag4: Tag = {
  _id: "tag4",
  value: "falco",
  label: "falco",
};
const tag5: Tag = {
  _id: "tag5",
  value: "sheik",
  label: "sheik",
};
const tag6: Tag = {
  _id: "tag6",
  value: "fox",
  label: "fox",
};
const tag7: Tag = {
  _id: "tag7",
  value: "peach",
  label: "peach",
};
const tag8: Tag = {
  _id: "tag8",
  value: "puff",
  label: "puff",
};
const tag9: Tag = {
  _id: "tag9",
  value: "ics",
  label: "ics",
};

export class TagService {
  tags: Array<Tag> = [tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9];
  getTags() {
    return this.tags;
  }

  tagExists(tag_label: string): boolean {
    return this.tags.some((tag) => {
      return tag.value === tag_label;
    });
  }

  addTag(value: string) {
    this.tags.push({
      _id: "temp_tag",
      value,
      label: value,
    });
    console.log(this.tags);
  }
}
