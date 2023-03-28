import Joi from "joi";

export class ShortenerValidate {
  private _errors: any[] = [];
  constructor(private props: any) {}

  private schema() {
    return Joi.object({
      url: Joi.string().uri().min(3).max(30).required(),
      alias: Joi.string().min(1).max(15).required(),
      visitor_counter: Joi.number().min(0).integer().max(999).required(),
      created_at: Joi.date().required(),
    });
  }

  validate() {
    const value = this.schema().validate(this.props, { abortEarly: false });
    if (value.error) {
      this._errors = value.error.details.map((p) => ({
        [p.path[0]]: p.message,
      }));
      return;
    }
    this._errors = null;
  }

  errors() {
    return this._errors;
  }
}
