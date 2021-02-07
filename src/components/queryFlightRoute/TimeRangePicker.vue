<template>
    <label style="display: inline-block; max-width: 360px;">
        <el-time-picker
                style="width: 160px;"
                v-model="start"
                :picker-options="startSelectableRange"
                :placeholder="placeholder"
                :format="format"
                :value-format="valueFormat"
                @change="startChange">
        </el-time-picker>
        <span style="display: inline-block; width: 12px; text-align: center;">-</span>
        <el-time-picker
                style="width: 160px;"
                v-model="end"
                :picker-options="endSelectableRange"
                :placeholder="placeholder"
                :format="format"
                :value-format="valueFormat"
                @change="endChange">
        </el-time-picker>
    </label>
</template>

<script>
  export default {
    name: "TimeRangePicker",
    model: {
      prop: 'timeSpan',
      event: 'update'
    },
    props: {
      timeSpan: {
        type: Object,
        default: null
      },
      placeholder: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: 'HH:mm'
      },
      valueFormat: {
        type: String,
        default: 'HH:mm'
      }
    },
    data() {
      return {
        startSelectableRange: {
          selectableRange: '00:00:00 - 23:59:59'
        },
        endSelectableRange: {
          selectableRange: '00:00:00 - 23:59:59'
        },
        start: null,
        end: null,
        time: {
          startTime: null,
          endTime: null
        }
      };
    },
    methods: {
      resetSelectableRange() {
        if (this.time.startTime && this.time.endTime) {
          if (+this.time.startTime > +this.time.endTime) {
            this.time.endTime = new Date(+this.time.startTime);
            this.end = this.$moment(this.time.endTime, this.format).format(this.format);
          }
        }
        if (this.time.startTime) {
          this.endSelectableRange.selectableRange = this.$moment(this.time.startTime).format(`HH:mm:ss`) + ' - 23:59:59';
        }
      },
      startChange() {
        this.time.startTime = this.start ? this.$moment(this.start, this.format).toDate() : null;
        this.resetSelectableRange();
        this.$emit('update', this.time);
      },
      endChange() {
        this.time.endTime = this.end ? this.$moment(this.end, this.format).toDate() : null;
        this.resetSelectableRange();
        this.$emit('update', this.time);
      },
      filterValue() {
        const filter = {};
        if (this.time.startTime) {
          filter.greaterOrEqualsThan = this.$moment(this.time.startTime).format('yyyy-MM-DD HH:mm:ss');
        }
        if (this.time.endTime) {
          filter.lessOrEqualsThan = this.$moment(this.time.endTime).format('yyyy-MM-DD HH:mm:ss');
        }
        return filter;
      }
    },
    created() {
      if (this.timeSpan == null) {
        return;
      }
      this.time.startTime = this.timeSpan.start;
      this.time.endTime = this.timeSpan.end;
      this.resetSelectableRange();
    },
    watch: {
      timeSpan() {
        if (this.timeSpan === this.time) {
          return;
        }

        if (this.timeSpan == null) {
          this.start = null;
          this.end = null;
          this.time = {
            startTime: null,
            endTime: null
          };
        } else {
          this.time = {
            startTime: this.timeSpan.start,
            endTime: this.timeSpan.end
          };
          this.start = this.time.startTime ? this.$moment(this.time.startTime, this.format).format(this.format) : null;
          this.end = this.time.endTime ? this.$moment(this.time.endTime, this.format).format(this.format) : null;
        }
        this.resetSelectableRange();
      }
    }
  };
</script>

<style scoped>

</style>
