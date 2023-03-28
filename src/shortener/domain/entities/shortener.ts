import { AliasRandom } from "../../../@seedwork/adapter/alias-random.adapter";
import { UniqueEntityId } from "../../../@seedwork/domain/vo/unique-entity-id.vo";
import { ShortenerValidate } from "../validators/shortener.validator";

export type ShortenerProperties = {
  url: string;
  alias?: string;
  visitor_counter?: number;
  created_at?: Date;
};

export type ShortenerPropsJson = Required<{ id: string } & ShortenerProperties>;

export class Shortener {
  uniqueId: UniqueEntityId;

  constructor(public readonly props: ShortenerProperties, id?: UniqueEntityId) {
    this.props.created_at = this.props.created_at || new Date();
    this.props.visitor_counter = this.props.visitor_counter || 0;
    this.props.alias = this.props.alias || AliasRandom.generate();
    this.uniqueId = id || new UniqueEntityId();
  }

  validate() {
    const validate = new ShortenerValidate(this.props);
    validate.validate();
    return validate.errors();
  }

  get url() {
    return this.props.url;
  }

  get alias() {
    return this.props.alias;
  }

  get visitor_counter() {
    return this.props.visitor_counter;
  }

  get created_at() {
    return this.props.created_at;
  }

  increase_visit() {
    this.props.visitor_counter++;
  }

  toJSON(): ShortenerPropsJson {
    return {
      id: this.uniqueId.id,
      url: this.url,
      alias: this.alias,
      visitor_counter: this.visitor_counter,
      created_at: this.created_at!,
    };
  }
}
