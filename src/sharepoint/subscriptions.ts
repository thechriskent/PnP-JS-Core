import { Queryable, QueryableCollection, QueryableInstance } from "./queryable";

/**
 * Describes a collection of webhook subscriptions
 *
 */
export class Subscriptions extends QueryableCollection {

    /**
     * Creates a new instance of the Subscriptions class
     *
     * @param baseUrl - The url or Queryable which forms the parent of this webhook subscriptions collection
     */
    constructor(baseUrl: string | Queryable, path = "subscriptions") {
        super(baseUrl, path);
    }

    /**
     * Returns all the webhook subscriptions or the specified webhook subscription
     *
     * @param subscriptionId The id of a specific webhook subscription to retrieve, omit to retrieve all the webhook subscriptions
     */
    public getById(subscriptionId: string): Subscription {
        const subscription = new Subscription(this);
        subscription.concat(`('${subscriptionId}')`);
        return subscription;
    }

    /**
     * Create a new webhook subscription
     *
     * @param notificationUrl The url to receive the notifications
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     * @param clientState A client specific string (defaults to pnp-js-core-subscription when omitted)
     */
    public add(notificationUrl: string, expirationDate: string, clientState?: string): Promise<SubscriptionAddResult> {

        const postBody = JSON.stringify({
            "clientState": clientState || "pnp-js-core-subscription",
            "expirationDateTime": expirationDate,
            "notificationUrl": notificationUrl,
            "resource": this.toUrl(),
        });

        return this.post({ body: postBody, headers: { "Content-Type": "application/json" } }).then(result => {

            return { data: result, subscription: this.getById(result.id) };
        });
    }
}

/**
 * Describes a single webhook subscription instance
 *
 */
export class Subscription extends QueryableInstance {

    /**
     * Renews this webhook subscription
     *
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     */
    public update(expirationDate: string): Promise<SubscriptionUpdateResult> {

        const postBody = JSON.stringify({
            "expirationDateTime": expirationDate,
        });

        return this.patch({ body: postBody, headers: { "Content-Type": "application/json" } }).then(data => {
            return { data: data, subscription: this };
        });
    }

    /**
     * Removes this webhook subscription
     *
     */
    public delete(): Promise<void> {
        return super.delete();
    }
}

export interface SubscriptionAddResult {
    subscription: Subscription;
    data: any;
}

export interface SubscriptionUpdateResult {
    subscription: Subscription;
    data: any;
}
