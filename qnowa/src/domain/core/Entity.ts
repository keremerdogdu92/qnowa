
export abstract class Entity<T> {
  public readonly id: string;
  protected readonly props: T;

  constructor(props: T, id?: string) {
    this.id = id ? id : crypto.randomUUID();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this.id === object.id;
  }
}
