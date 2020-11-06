import { Deserializable } from './deserializable.model';

export class Mining implements Deserializable {
    public id = '';
    public miningId = '';
    public minedOn = '';
    public updatedOn: '';
    public text = '';

    public source:
        | {
              id: string;
              title: string;
              url: string;
              type: string;
          }
        | undefined;

    public collection:
        | {
              tags: string[];
          }
        | undefined;

    public user?:
        | {
              id: string;
              name: string;
          }
        | undefined;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
