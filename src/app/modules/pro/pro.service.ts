import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { Upload } from '../../services/api/upload';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProService {
  protected cachedResponse: any;

  public readonly ratios = ['16:9', '16:10', '4:3', '1:1'];

  proSettings: any = {};
  proSettings$: BehaviorSubject<any> = new BehaviorSubject(this.proSettings);

  constructor(protected client: Client, protected uploadClient: Upload) {}

  async isActive(): Promise<boolean> {
    const result: any = await this.client.get('api/v2/pro');

    if (!result || typeof result.isActive === 'undefined') {
      throw new Error('Unable to check your Pro status');
    }
    this.cachedResponse = result;

    return Boolean(result.isActive);
  }

  async hasSubscription(): Promise<boolean> {
    if (!this.cachedResponse) {
      await this.isActive();
    }
    return Boolean(this.cachedResponse.has_subscription);
  }

  async expires(): Promise<number> {
    if (!this.cachedResponse) {
      await this.isActive();
    }
    return Number(this.cachedResponse.expires) || 0;
  }

  async disable(): Promise<boolean> {
    await this.client.delete('api/v2/pro');
    return true;
  }

  async get(remoteUser: string | null = null): Promise<{ isActive; settings }> {
    const endpoint = ['api/v2/pro/settings'];

    if (remoteUser) {
      endpoint.push(remoteUser);
    }

    const { isActive, settings } = (await this.client.get(
      endpoint.join('/'),
      {},
      { cache: false }
    )) as any;

    if (settings) {
      if (settings.tag_list) {
        settings.tag_list = settings.tag_list.map(({ tag, label }) => {
          const formattedTag = `#${tag}`;

          return { tag: formattedTag, label };
        });
      }

      if (!settings.scheme) {
        settings.scheme = 'light';
      }

      if (!settings.ratio) {
        settings.ratio = this.ratios[0];
      }
    }

    this.proSettings = settings;

    if (this.proSettings) {
      this.proSettings.is_active = isActive;
      this.proSettings$.next(this.proSettings);
    }

    return { isActive, settings };
  }

  async set(settings, remoteUser: string | null = null): Promise<boolean> {
    const endpoint = ['api/v2/pro/settings'];

    if (remoteUser) {
      endpoint.push(remoteUser);
    }

    await this.client.post(endpoint.join('/'), settings);

    // refresh proSettings$ after changes are made
    this.get(remoteUser);

    return true;
  }

  async domainCheck(
    domain: string,
    remoteUser: string | null = null
  ): Promise<{ isValid: boolean }> {
    const endpoint = ['api/v2/pro/settings/domain'];

    if (remoteUser) {
      endpoint.push(remoteUser);
    }

    const { isValid } = (await this.client.get(
      endpoint.join('/'),
      {
        domain,
      },
      { cache: false }
    )) as any;

    return { isValid };
  }

  async upload(type: string, file, remoteUser: string | null = null) {
    const endpoint = ['api/v2/pro/settings/assets', type];

    if (remoteUser) {
      endpoint.push(remoteUser);
    }

    const response = (await this.uploadClient.post(endpoint.join('/'), [
      file,
    ])) as any;

    if (!response || response.status !== 'success') {
      throw new Error(response.message || 'Invalid server response');
    } else {
      // refresh proSettings$ after changes are made
      this.get(remoteUser);
    }

    return true;
  }
}
