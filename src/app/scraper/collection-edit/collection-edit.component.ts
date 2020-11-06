import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { LocalNotificationService } from '../../services/common/local-notification.service';
import { Collection } from '../../shared/models/collection.model';
import { UtilService } from '../../services/util.service';

@Component({
	selector: 'app-collection-edit',
	templateUrl: './collection-edit.component.html',
	styleUrls: ['./collection-edit.component.scss']
})

export class CollectionEditComponent implements OnInit {
	@ViewChild('modalForm') modalForm;
	form: FormGroup;

	dialogType = '';
	collection: Collection;

	// tag chip related
 	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

	constructor(
		private fb: FormBuilder,
		public matDialogRef: MatDialogRef<CollectionEditComponent>,
		@Inject(MAT_DIALOG_DATA) data,
		private localNotificationService: LocalNotificationService,
		private utilService: UtilService,
	) {
		this.dialogType = data.dialogType;
		this.collection  = { ...data.collection };

		this.form = this.fb.group({
			title: [this.collection.title, Validators.required],
			tags: [this.collection.tags, Validators.required],
			archived: [this.collection.archived],
		});
	}

	ngOnInit(): void {
	}

	// Remove tag
	remove(tag: any): void {
		const index = this.collection.tags.indexOf(tag);
		if (index >= 0) {
			this.collection.tags.splice(index, 1);
		}
		this.form.get('tags').updateValueAndValidity();
	}

	// Add tag
	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// add tag
		if ((value || '').trim()) {
			this.collection.tags.push(value.trim());
		}
		// reset the input value
		if (input) {
			input.value = '';
		}
		this.form.get('tags').updateValueAndValidity();
		// console.log('CollectionEditComponent: add: tags = ', this.collection.tags);
	}

	save() {
		this.form.updateValueAndValidity();

		if (!this.form.valid) {
			this.utilService.getFormValidationErrors(this.form);
			this.localNotificationService.error({ message: 'You must complete the required fields.' });
			return;
		}

		const result: Collection = this.form.value;
        result.id = this.collection.id;
		console.log('CollectionEditComponent: save: result = ', result);
		this.matDialogRef.close(result);
	}


	close() {
		this.matDialogRef.close();
	}

}
