import { Deserializable } from "src/app/models/deserializable.model";
import { DATA_TYPE, URL_CODE } from "../../models/ontology/onto-data-types";

export class OntoData implements Deserializable {
  public id!: string;
  public urlCode!: URL_CODE;
  public endpoint!: string;
  public dataType!: DATA_TYPE;
  public description!: string;
  public date!: Date;
  public keywords!: string[];

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class OntoDataSearch extends OntoData {
  public score: number = undefined as any;
  public pageIds: string[] = undefined as any;
}

export class OntoDataSearchGroup implements Deserializable {
  public score: number = undefined as any;
  public groups: OntoData[] = undefined as any;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
