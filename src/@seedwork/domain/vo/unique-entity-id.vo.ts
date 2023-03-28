import { v4 as uuid, validate as uuidValidate } from "uuid";

export class UniqueEntityId {
  constructor(private readonly _id?: string) {
    this._id = this._id || uuid();
    this.validate();
  }

  get id() {
    return this._id;
  }

  private validate() {
    const isValid = uuidValidate(this.id!);
    if (!isValid) {
      throw new Error("UUID Invalid");
    }
  }
}
