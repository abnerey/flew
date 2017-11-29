# FLEW Handler &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]

## Flow Error Awareness library for Angular 2+

This is a library for manage the flow control of errors/exceptions in an Angular2+ application, especially for async/await functions, reducing the extense boilerplate of try/catch that this kind of functions may need; BTW, also help you with normal functions exception handling. FLEW Handler provide you the next capabilities through custom top level decorators, keeping the AngularLike syntax we already love:

* **Notification:** FLEW decorators for exception handling let you notify in success and error case. You can create notifications for the entire application, using that success/error notification for every case; also you can declare success/error notifications for a single case in each function (for normal functions only error notifications).
* **Translation:** FLEW notifications have the ability to be translated, you decide when do it or not, through FLEW message object/model.
* **Transformation:** FLEW requires a specific object form to use in notifications (really simple, only three properties), but just in case you cant't provide directly that object form, FLEW able you to provide transformation functions that returns the form required. Transformation functions can be provided for the entire application or function by function, we dive in this when we see how to implement that.

Please, for any suggestions or fixes, don't doubt and send me an email to: superengasado@outlook.com or send your pull request, working together we'll create something amazing or helpful or both (why not? ;D). If you detect a bug, open an issue, don't be shy; I'll work on it almost instantly, well, may be not instanly, but ASAP, I won't keep you waiting for... mmm, forever?

Saying that, let's code!

## Examples

The first step is import the FlewModule in your Angular's main module, commonly AppModule

```ts
@NgModule({
  declarations: [...],
  imports: [
	...,
	FlewModule.forRoot({
	  notifier: NotificationService, 			 
	    // Dependency class we'll use to notify (Required)
	  translate: TranslateService, 			 
	    // Dependency class we'll use to translate
	  transformError: yourFunctionOnError, 	 
	    // Pure function that will transform error messages
      transformSuccess: yourFunctionOnSuccess, 
        // Pure function that will transform success messages
	  success: {} 							 
	    // Default success message
	}),
	...
  ],
  providers: [...],
  bootstrap: [...],
  exports: [...]
})
export class AppModule {
}
```

* **notifier:** This is the only property that is required to use FLEW, is the minimum needed by FLEW to work. Rigth now the only dependency supported to notify is [angular2-notifications](https://jaspero.co/resources/projects/ng-notifications).
* **translate:** Here you insert the dependency Flew will need to translate your messages, if you don't need translate, don't put the property and Flew will deactivate translation capabilities. The only dependency supported to translate is [ngx-translate](http://www.ngx-translate.com/).
* **transformError:** Here you may put a function that receives anything, and return a FlewMessage instance. * 
* **transformSuccess:** The same as above, but in success case (you already know).
* **success:** FlewMessage to use by default in all success cases. This will be used if you don't provide success message in a function specifically. When you dont put success message in a function and neither in this property, FLEW wont't notify anything on success, you know, life goes on.

In future releases I'll improve and expand the capabilities of notify and translate, allowing more dependencies or converting FLEW in a solution out-of-the-box, containing everything you need, everybody like plug and play. 

```
Care about this:

Right now FLEW don't provide to Angular's dependency injection core the dependencies received in notifier and translate. 
You should provide them manually, because in this way Flew ensures you implement everything that needs every dependency 
in your whole application, like components required in certain places and reasons like that, keeping the Single Responsability
Pattern, FLEW only should care about itself. If you don't do it, FLEW notify and translation capabilities won't work, because 
FLEW get the respective instances of that dependencies directly from Angular Dependency Injector.
```


FlewMessage is only more syntactic sugar, but make the general implementation more sexy and standardized, we'll dive in this later.